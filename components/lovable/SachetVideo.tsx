export default function SachetVideo() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-white/5 min-h-[320px] md:min-h-[400px]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/sache-moto.jpg"
      >
        <source src="/sache-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
