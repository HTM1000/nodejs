// Netflix Spotify

// Importação de clientes via CSV (Excel)
// 1GB - 1.000.000
// POST/upload import.csv

// upload de 10mbs

// 100s -> Inserções no banco de dados

// 10mbs -> 10.000

// Readables Streams (lendo aos poucos) / Writable Streams (enviando aos poucos) 

// Stdin (entrada) / Stdout (saída)

// Conectar streams
// process.stdin.pipe(process.stdout)

// Stream nunca poderá estar em um formato primitivo, deve ser em buffer

import { Readable, Writable, Transform, Duplex } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1

  _read() {
    const i = index++

    setTimeout(() => {
      if(i > 100) {
        this.push(null)
      } else {
        const buff = Buffer.from(String(i))
  
        this.push(buff)
      }
    }, 1000)
  }
}

// nao retorna nada, apenas processa o dado
class MultiplyByTenStream extends Writable {
  _write(chunk, enconding, callback) {
    console.log(Number(chunk.ToString()) * 10)
    callback()
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, enconding, callback) {
    const transformed = Number(chunk.ToString()) * -1

    //primeiro param é o erro
    callback(null, Buffer.from(String(transformed)))
  }
}

//duplex nao pode ser transformado, união com o modo leitura e escrita

new OneToHundredStream()
    .pipe(new InverseNumberStream())
    .pipe(new MultiplyByTenStream())