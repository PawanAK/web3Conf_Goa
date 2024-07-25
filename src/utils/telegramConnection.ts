import fs from 'fs';
import path from 'path';

export const saveTelegramConnection = async (telegramId: string, walletAddress: string) => {
  const data = {
    telegramId,
    walletAddress,
  };

  const filePath = path.join(process.cwd(), 'telegram_connections.json');

  try {
    let existingData: any[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    }

    existingData.push(data);

    await fs.promises.writeFile(filePath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error('Error saving Telegram connection:', error);
    throw error;
  }
};