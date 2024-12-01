import java.util.Arrays;

public class EncryptedFrame {
    FrameHeader frameHeader;
    byte[] encryptedData;
    byte[] mic;
    byte[] pn;

    public EncryptedFrame(FrameHeader frameHeader, byte[] encryptedData, byte[] mic, byte[] pn) {
        this.frameHeader = frameHeader;
        this.encryptedData = encryptedData;
        this.mic = mic;
        this.pn = pn;
    }

    @Override
    public String toString() {
        return String.format(
            "Header:\n%sMIC: %s\nEncrypted data: %s\nPN: %s\n",
            frameHeader.toString().indent(2),
            Main.bytesToHex(mic),
            Main.bytesToHex(encryptedData),
            Arrays.toString(pn)
        );
    }
}
