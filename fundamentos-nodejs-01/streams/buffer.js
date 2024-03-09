//representação de um espaço na memória de um computador, maneira de salvar e ler da memória de uma maneira performatica, guarda os dados de maneira binária, api criado pela incapacidade do js lidar com dados binários nativamente (hoje é possível com a TypedArray mas não é utilizada), conversando de uma "maneira mais baixo nivel"

//Buffer 6f = o 6b = k
const buff = Buffer.from("ok")

console.log(buff.toJSON())