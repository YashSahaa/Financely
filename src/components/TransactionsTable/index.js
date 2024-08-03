import { Radio, Select, Table } from 'antd';
import { parse, unparse } from 'papaparse';
import React, { useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { toast } from 'react-toastify';

function TransactionsTable({transactions,addTransaction,fetchTransaction}) {

    const { Option } = Select; 
    const [search,setSearch] = useState("");
    const [typeFilter,setTypeFilter] = useState(""); 
    const [sortKey,setSortKey] = useState("");

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
          },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];


    let filteredTransactions = transactions.filter((item)=>{
      return (item.name.toLowerCase().includes(search.toLowerCase())) &&  ((item.type.includes(typeFilter)))
    });

    let mapfilteredTransactions = filteredTransactions.map((transaction,index) => ({
      ...transaction,
      key:index, // Ensure each transaction has a unique key
    }));
    
    let sortedTransactions = mapfilteredTransactions.sort((a,b)=>{
      if(sortKey === "date"){
        return new Date(a.date) - new Date(b.date);
      }else if(sortKey === "amount"){
        return a.amount - b.amount;
      }else{
        return 0;
      }
    });

    function exportCSV(){
      var csv = unparse({
        fields: ["name","type","tag","date","amount"],
        data: transactions,
      });
      var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download='transactions.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function importCSV(event){
      event.preventDefault();
      try{
        parse(event.target.files[0],{
          header:true,
          complete: async function (results) {
            for (const transaction of results.data) {
              console.log(transaction);
              const newTransaction = {
                ...transaction,
                amount:parseFloat(transaction.amount),
              };
              await addTransaction(newTransaction,true);
            }
          },
        })
        toast.success("All Transactions added");
        fetchTransaction();
        event.target.files=null;
      }catch(e){
        toast.error(e);
      }
    }

    return (
        <div style={{width:"100" , padding:"0rem 2rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:"1rem",alignItems:"center",marginBottom:"1rem"}}>
              <div className='input-flex'>
                {/* <img src="" width="16"/>  {/*searchImg*/ }
                <IoMdSearch />
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder='Search by name'/>
              </div>
              
              <Select className='select-input' onChange={(value)=>setTypeFilter(value)} value={typeFilter} placeholder="Filter" allowClear>
                  <Option value="">All</Option>
                  <Option value="income">Income</Option>
                  <Option value="expense">Expense</Option>
              </Select>
            </div>
            
            <div style={{display:"flex",justifyContent:"space-between",width:"99%",alignItems:"center",marginBottom:"1rem"}}>
              <h2>My Transactions</h2>
              <Radio.Group className='input-radio' onChange={(e)=>setSortKey(e.target.value)} value={sortKey}>
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort by Date</Radio.Button>
                <Radio.Button value="amount">Sort by Amount</Radio.Button>
              </Radio.Group>

              <div style={{display:"flex",justifyContent:"space-between",width:"300px"}}>
                <button className='btn' onClick={exportCSV}>Export to CSV</button>
                <label htmlFor="file-csv" className='btn btn-blue'>Import to CSV</label>
                <input id='file-csv' type='file' accept='.csv' required onChange={importCSV} style={{display:"none"}}/>
              </div>
            </div>
            <Table  dataSource={sortedTransactions} columns={columns} />
        </div>
    )
}

export default TransactionsTable;