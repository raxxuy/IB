import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;

public class CCMP {
    private static SecretKey aesKey = null;
    private static final byte[] pn = new byte[6];

    public CCMP(byte[] key) {
        aesKey = new SecretKeySpec(key, "AES");
    }

    public EncryptedFrame encryptFrame(ClearTextFrame frame) throws Exception {
        // Increment static pn because of encryption instance.
        // Set a copy of the current pn to the frame to avoid issues.
        incrementBytes(pn, 0);
        frame.setPn(Arrays.copyOf(pn, pn.length));

        // Nonce (initially 13 bytes)
        // Concatenate the incremented pn with the MAC source trimmed to 6 bytes, add padding to make it a multiple of 16.
        byte[] nonce = padding(concat(frame.pn, Arrays.copyOf(frame.frameHeader.source, 6)));
        byte[] mic = generateMIC(frame.frameHeader, frame.data, nonce);

        // Trim the nonce to 13 bytes and add padding for the counter.
        // Encrypt the nonce and trim it to 8 bytes so it can be used with MIC.
        nonce = padding(Arrays.copyOf(nonce, 13));
        byte[] encryptedNonce = Arrays.copyOf(AES.encrypt(nonce), 8);

        for (int i = 0; i < mic.length; i++) {
            mic[i] = (byte) (mic[i] ^ encryptedNonce[i]);
        }

        // Increment the counter-part of the nonce (13-15).
        incrementBytes(nonce, 13);

        byte[][] blocks = convertBlocks(padding(frame.data));
        byte[] encryptedData = new byte[0];

        // AES-CTR
        for (byte[] block : blocks) {
            encryptedNonce = AES.encrypt(nonce);

            for (int i = 0; i < block.length; i++) {
                block[i] = (byte) (block[i] ^ encryptedNonce[i]);
            }

            // Combine arrays (can be optimized).
            encryptedData = concat(encryptedData, block);
            incrementBytes(nonce, 13);
        }

        return new EncryptedFrame(frame.frameHeader, encryptedData, mic, frame.pn);
    }

    public ClearTextFrame decryptFrame(EncryptedFrame frame) throws Exception {
        // Nonce
        byte[] nonce = padding(concat(frame.pn, Arrays.copyOf(frame.frameHeader.source, 6)));
        byte[] mic = frame.mic;

        // Trim the nonce to 13 bytes and add padding for the counter.
        nonce = padding(Arrays.copyOf(nonce, 13));
        byte[] encryptedNonce = Arrays.copyOf(AES.encrypt(nonce), 8);

        for (int i = 0; i < mic.length; i++) {
            mic[i] = (byte) (mic[i] ^ encryptedNonce[i]);
        }

        incrementBytes(nonce, 13);

        byte[][] blocks = convertBlocks(padding(frame.encryptedData));
        byte[] decryptedData = new byte[0];

        for (byte[] block : blocks) {
            encryptedNonce = AES.encrypt(nonce);

            for (int i = 0; i < block.length; i++) {
                block[i] = (byte) (block[i] ^ encryptedNonce[i]);
            }

            decryptedData = concat(decryptedData, block);
            incrementBytes(nonce, 13);
        }

        // Trim the nonce to 13 bytes and add padding for MIC.
        nonce = padding(Arrays.copyOf(nonce, 13));
        byte[] newMic = generateMIC(frame.frameHeader, decryptedData, nonce);

        // Check for MIC != MIC'
        if (Arrays.compare(newMic, mic) != 0) {
            throw new Exception("Integrity check failed!");
        }

        // Trim the decrypted data to remove trailing zeros.
        ClearTextFrame decryptedFrame = new ClearTextFrame(frame.frameHeader, trim(decryptedData));
        decryptedFrame.setPn(Arrays.copyOf(frame.pn, frame.pn.length));

        return decryptedFrame;
    }

    public byte[] generateMIC(FrameHeader header, byte[] data, byte[] nonce) throws Exception {
        // Initially encrypt the nonce.
        // Combine header to a single array and add padding.
        byte[] encryptedNonce = AES.encrypt(nonce);
        byte[] fullHeader = padding(concat(header.source, header.destination));

        // Divide header into blocks.
        // AES-CBC
        for (byte[] block : convertBlocks(fullHeader)) {
            for (int i = 0; i < block.length; i++) {
                encryptedNonce[i] = (byte) (encryptedNonce[i] ^ block[i]);
            }

            encryptedNonce = AES.encrypt(encryptedNonce);
        }

        // Add padding to data and divide into blocks.
        byte[][] blocks = convertBlocks(padding(data));

        // AES-CBC
        for (byte[] block : blocks) {
            for (int i = 0; i < block.length; i++) {
                encryptedNonce[i] = (byte) (encryptedNonce[i] ^ block[i]);
            }

            encryptedNonce = AES.encrypt(encryptedNonce);
        }

        // Return first 8 bytes as MIC.
        return Arrays.copyOf(encryptedNonce, 8);
    }

    // Helper class
    public static class AES {
        public static byte[] encrypt(byte[] data) throws Exception {
            Cipher cipher = Cipher.getInstance("AES/ECB/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, aesKey);
            return cipher.doFinal(data);
        }
    }

    // Helper methods
    public static byte[] padding(byte[] data) throws Exception {
        return data.length % 16 == 0 ? data : concat(data, new byte[16 - data.length % 16]);
    }

    public static byte[] trim(byte[] data) {
        int end = data.length;

        for (int i = data.length - 1; i >= 0; i--) {
            if (data[i] == 0) end--;
            else break;
        }

        return Arrays.copyOf(data, end);
    }

    public static byte[] concat(byte[] ...b) throws Exception {
        ByteArrayOutputStream stream = new ByteArrayOutputStream();

        for (byte[] bytes : b) {
            stream.write(bytes);
        }

        return stream.toByteArray();
    }

    public static byte[][] convertBlocks(byte[] data) {
        byte[][] blocks = new byte[data.length / 16][16];

        for (int i = 0; i < data.length / 16; i++) {
            System.arraycopy(data, i * 16, blocks[i], 0, 16);
        }

        return blocks;
    }

    public static void incrementBytes(byte[] data, int limit) {
        for (int i = data.length - 1; i >= limit; i--) {
            data[i]++;
            if (data[i] != 0) break;
        }
    }
}
