public class FrameHeader {
    byte[] source;
    byte[] destination;

    public FrameHeader(String source, String destination) {
        this.source = source.getBytes();
        this.destination = destination.getBytes();
    }

    @Override
    public String toString() {
        return String.format(
            "Source: %s\nDestination: %s",
            new String(source),
            new String(destination)
        );
    }
}
