import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface Statement {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const storedStatement = localStorage.getItem('@GoFinances:statement');

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (storedStatement) {
      return JSON.parse(storedStatement).transactions;
    }
    return [];
  });

  const [balance, setBalance] = useState<Balance>(() => {
    if (storedStatement) {
      return JSON.parse(storedStatement).balance;
    }
    return {} as Balance;
  });

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<Statement>('transactions');

      const formattedTransactions = response.data.transactions.map(
        transaction => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
          formattedDate: formatDate(transaction.created_at),
        }),
      );

      const formattedBalance = {
        income: formatValue(response.data.balance.income),
        outcome: formatValue(response.data.balance.outcome),
        total: formatValue(response.data.balance.total),
      };

      setTransactions(formattedTransactions);
      setBalance(formattedBalance);

      localStorage.setItem(
        '@GoFinances:statement',
        JSON.stringify({
          transactions: formattedTransactions,
          balance: formattedBalance,
        }),
      );
    }

    loadTransactions();
  }, [transactions]);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formatValue(balance.income)}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {formatValue(balance.outcome)}
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formatValue(balance.total)}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactions.map(transaction => (
              <tbody key={transaction.id}>
                <tr>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome' && '- '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
