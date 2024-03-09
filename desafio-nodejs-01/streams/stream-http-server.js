import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvFilePath = new URL('./arquivo.csv', import.meta.url);

const stream = fs.createReadStream(csvFilePath);

const csvOptions = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2,
});

async function sendTaskData() {
  const parser = stream.pipe(csvOptions);

  for await (const line of parser) {
    const [title, description] = line;

    const response = await fetch('http://localhost:3434/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar os dados: ${response.statusText}`);
    }

    console.log('Dados enviados com sucesso:', title, description);
  }
}

sendTaskData()