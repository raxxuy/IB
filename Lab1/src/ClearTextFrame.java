import java.util.Arrays;

public class ClearTextFrame {
    FrameHeader frameHeader;
    byte[] data;
    byte[] pn = new byte[6];

    public ClearTextFrame(FrameHeader frameHeader, byte[] data) {
        this.frameHeader = frameHeader;
        this.data = data;
    }

    public void setPn(byte[] pn) {
        this.pn = pn;
    }

    @Override
    public String toString() {
        return String.format(
            "Header:\n%sData: %s\nPN: %s\n",
            frameHeader.toString().indent(2),
            new String(data),
            Arrays.toString(pn)
        );
    }
}
