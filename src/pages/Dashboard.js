import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/AddExpense';
import AddIncomeModal from '../components/Modals/AddIncome';
import { addDoc, collection, getDocs, query} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';
import ChartComponent from '../components/Charts';
import NoTransaction from '../components/NoTransaction';

function Dashboard() {
  const [transactions,setTransactions] = useState([]);
  const [loading,setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible,setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible,setIsIncomeModalVisible] = useState(false);

  const [income,setIncome] = useState(0);
  const [expense,setExpense] = useState(0);
  const [totalBalance,setTotalBalance] = useState(0);

  useEffect(()=>{
    //Get all docs from collections
    fetchTransactions();
  },[user]);

  useEffect(()=>{
    calculateBalance();
  },[transactions]);

  const showExpenseModal = ()=>{
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal = ()=>{
    setIsIncomeModalVisible(true);
  }
  const handleExpenseCancel = ()=>{
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = ()=>{
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type)=>{
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name, 
    };

    addTransaction(newTransaction,true);
  };

  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with id : ",docRef.id);
      if(!many){
        toast.success("Transation Added");
      } 
      let newArray = transactions;
      newArray.push(transaction);
      setTransactions(newArray);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document",e);
      if(!many){
        toast.error("Coudn't add transaction");
      } 
    }
  }
    
  

  async function fetchTransactions() {
    setLoading(true);
    if(user){
      const q = query(collection(db,`users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc)=>{
        transactionArray.push(doc.data());
      });
      setTransactions(()=>{
       return [...transactionArray]
      });
      console.log("transactionArray",transactionArray);
      toast.success("Transactions Fetched!");
      
    }
    setLoading(false);
  }

  function calculateBalance(){
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }

  let sortedTransactions = transactions.sort((a,b)=>{
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header/>
      {loading  ? (
        <p>Loading...</p>
      ):(
        <>
          <Cards income={income} expense={expense} totalBalance={totalBalance} showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal}/>
          {transactions.length!==0 ?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransaction/>}
          <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish}/>
          <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}/>
          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransaction={fetchTransactions}/>
          
        </>
      )};
      
    </div>
  )
}

export default Dashboard;
