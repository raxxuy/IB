public class Main {
    public static void main(String[] args) throws Exception {
        byte[] aesKey = "0000000000000000".getBytes();

        CCMP ccmp = new CCMP(aesKey);

        ClearTextFrame clearTextFrame = new ClearTextFrame(
            new FrameHeader("Source", "Dest"),
            "test_data".getBytes()
        );

        System.out.println(clearTextFrame);

        EncryptedFrame encryptedFrame = ccmp.encryptFrame(clearTextFrame);
        System.out.println(encryptedFrame);

        ClearTextFrame decryptedFrame = ccmp.decryptFrame(encryptedFrame);
        System.out.println(decryptedFrame);
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();

        for (byte b : bytes) {
            sb.append(String.format("%02X ", b));
        }

        return sb.toString();
    }
}