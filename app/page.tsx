import PresenceCanvas from "@/components/PresenceCanvas";
import LenisProvider from "@/components/LenisProvider";
import DepthField from "@/components/DepthField";
import PresenceEngine from "@/components/PresenceEngine";
import FormationText from "@/components/FormationText";
import NeuralField from "@/components/NeuralField";
import OriginStamp from "@/components/OriginStamp";

export default function Page() {
  return (
    <main className="relative min-h-[300vh]">
      <LenisProvider />
      <PresenceEngine />
      <PresenceCanvas />
      <DepthField />
      <NeuralField />
      <FormationText />
      <OriginStamp />
    </main>
  );
}
