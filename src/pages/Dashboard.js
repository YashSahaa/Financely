import React, { useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/AddExpense';
import AddIncomeModal from '../components/Modals/AddIncome';

function Dashboard() {
  const [isExpenseModalVisible,setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible,setIsIncomeModalVisible] = useState(false);

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

  const onFinish = ()=>{
    console.log("onFinish");
  }

  return (
    <div>
      <Header/>s
      <Cards showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal}/>
      <AddExpenseModal isExpenseModalVisible={isExpenseModalVisible} handleExpenseCancel={handleExpenseCancel} onFinish={onFinish}/>
      <AddIncomeModal isIncomeModalVisible={isIncomeModalVisible} handleIncomeCancel={handleIncomeCancel} onFinish={onFinish}/>
    </div>
  )
}

export default Dashboard;
