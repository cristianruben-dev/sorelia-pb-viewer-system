import { prisma } from "./prisma";

export async function getSystemConfig(): Promise<Record<string, string>> {
	try {
		const configs = await prisma.systemConfig.findMany();

		const configObj: Record<string, string> = {
			site_title: "Sistema Visualizador",
			site_logo: "",
			site_favicon: "",
		};

		for (const config of configs) {
			configObj[config.key] = config.value;
		}

		return configObj;
	} catch (error) {
		return {
			site_title: "Sistema Visualizador",
			site_logo: "",
			site_favicon: "",
		};
	}
}
