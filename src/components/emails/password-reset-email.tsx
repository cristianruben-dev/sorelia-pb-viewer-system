import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Tailwind,
} from "@react-email/components";

interface PasswordResetEmailProps {
  code: string;
  email: string;
}

export default function PasswordResetEmail({
  code = "123456",
  email = "usuario@ejemplo.com",
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Tu código de verificación es {code}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] font-sans">
          <Container className="bg-white mx-auto pt-5 pb-12 mb-16">
            <Heading className="text-[#333] text-2xl font-bold my-10 px-10 text-center">
              Restablecer Contraseña
            </Heading>

            <Text className="text-[#333] text-base leading-[26px] my-4 px-10">
              Hola,
            </Text>

            <Text className="text-[#333] text-base leading-[26px] my-4 px-10">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta asociada a <strong>{email}</strong>.
            </Text>

            <Section className="bg-[#f4f4f4] rounded-lg my-8 mx-10 p-6 text-center">
              <Text className="text-[#666] text-sm font-medium m-0 mb-2 uppercase tracking-wider">
                Tu código de verificación es:
              </Text>
              <Text className="text-black text-5xl font-bold tracking-[8px] m-0 font-mono">
                {code}
              </Text>
            </Section>

            <Text className="text-[#333] text-base leading-[26px] my-4 px-10">
              Este código expirará en <strong>15 minutos</strong>.
            </Text>

            <Hr className="border-[#e6ebf1] my-5 mx-10" />

            <Text className="text-[#8898aa] text-sm leading-6 my-2 px-10">
              Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
            </Text>

            <Text className="text-[#8898aa] text-sm leading-6 my-2 px-10">
              Por razones de seguridad, nunca compartas este código con nadie.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
