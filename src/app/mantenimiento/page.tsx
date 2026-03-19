import Image from "next/image";
import fondoImg from "../../assets/fondo.png";
import logotipoImg from "../../assets/logotipo.jpg";

export const metadata = {
  title: "METRA | Plataforma en construcción",
}

export default function MantenimientoPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#1c1c1c] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#eaeaea] py-4">
        <div className="container mx-auto flex justify-center">
          <Image
            src={logotipoImg}
            alt="Logo Seguridad"
            className="h-[82px] w-auto object-contain"
            priority
          />
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-100px)] flex items-center justify-center text-center py-10 px-5">
        <div className="container mx-auto flex flex-col items-center">
          {/* Illustration */}
          <Image
            src={fondoImg}
            alt="Construcción"
            className="w-full max-w-[300px] md:max-w-[580px] mb-8 opacity-95"
            priority
          />

          {/* Content */}
          <div className="text-2xl font-medium tracking-[1px] mb-[18px] md:mb-6">
            METRA
          </div>

          <h1 className="font-vollkorn text-[2rem] md:text-[4.2rem] font-extrabold uppercase leading-[1.2] mb-[22px] md:mb-[38px] max-w-5xl">
            Estamos en construcción de la plataforma
          </h1>

          <p className="text-[1.2rem] text-[#6c757d]">
            Si encuentras algún inconveniente, puedes escribirnos a{" "}
            <a
              href="mailto:soporte@metradlpc.guanajuato.gob.mx"
              className="text-[#0d3b66] underline hover:opacity-80 transition-opacity"
            >
              soporte@metradlpc.guanajuato.gob.mx
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
