const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const generateRandomTransaction = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = uuidv4();
      const amount = Math.floor(Math.random() * 1001); // Valor entre 0 e 1000
      const type = Math.random() < 0.5 ? "crédito" : "débito";

      const response = await axios.post(
        "https://ruwcrrmwj6.execute-api.us-east-1.amazonaws.com/produce",
        { id, amount, type }
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

const generateTransactions = (count) => {
  const transactionsPromises = [];

  for (let i = 0; i < count; i++) {
    transactionsPromises.push(generateRandomTransaction());
  }

  return transactionsPromises;
};

Promise.all(generateTransactions(100))
  .then((transactions) => {
    console.log(transactions);
  })
  .catch((error) => {
    console.error("Erro ao gerar transações:", error);
  });
