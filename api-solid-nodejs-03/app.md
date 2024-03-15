# App
Gympass style app

## RFs (Requisitos funcionais)

- [X] Deve ser possivel se cadastrar;
- [X] Deve ser possivel se autenticar;
- [X] Deve ser possivel obter o perfil de um usuário logado;
- [ ] Deve ser possivel obter o número de check-ins realizado pelo usuário logado;
- [ ] Deve ser possivel obter histórico de check-ins;
- [ ] Deve ser possivel o usuário buscar academias próximas;
- [ ] Deve ser possivel o usuário buscar academias pelo nomes;
- [X] Deve ser possivel o usuário realizar o check-in em uma academia;
- [ ] Deve ser possivel validar o check-in do usuário;
- [ ] Deve ser possivel cadastrar uma academia;

## RNs (Regras de negócios)

- [X] O usuário não deve pode se cadastrar com um e-mail duplicado;
- [X] O usuário não pode fazer dois check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não tiver perto da academia;
- [ ] O check-in só pode ser validado até 20 min após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academina só pode ser cadastrada por administradores;


## RNFs (Requisitos não-funcionais)

- [X] A senha do usuário precisa estar criptografada;
- [X] Os dados da aplicação precisam estar persistidos em um banco PostgresSQL;
- [ ] Todas listas de dados precisam estar paginas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (json web token);