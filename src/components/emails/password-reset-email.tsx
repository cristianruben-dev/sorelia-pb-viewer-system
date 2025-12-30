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
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Restablecer Contraseña</Heading>

          <Text style={text}>
            Hola,
          </Text>

          <Text style={text}>
            Recibimos una solicitud para restablecer la contraseña de tu cuenta asociada a <strong>{email}</strong>.
          </Text>

          <Section style={codeContainer}>
            <Text style={codeLabel}>Tu código de verificación es:</Text>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={text}>
            Este código expirará en <strong>15 minutos</strong>.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
          </Text>

          <Text style={footer}>
            Por razones de seguridad, nunca compartas este código con nadie.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "560px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "8px",
  margin: "32px 40px",
  padding: "24px",
  textAlign: "center" as const,
};

const codeLabel = {
  color: "#666",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const codeText = {
  color: "#000",
  fontSize: "48px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: "monospace",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 40px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
  padding: "0 40px",
};
