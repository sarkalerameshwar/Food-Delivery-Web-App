import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food items.");
      }
    } catch (error) {
      toast.error("Server error while fetching food list.");
      console.error(error);
    }
  };

  const removeFood = async(foodId) =>{
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if(response.data.success){
      toast.success("Food item removed successfully");
    }else{
      toast.error("Failed to remove food item");
    }
  }

  useEffect(() => {
    fetchList();
  }, []); // ✅ Only run once on component mount

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img
              src={`${url}/image/${item.image}`}
              alt={item.name || "food item"}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={()=>removeFood(item._id)} className='cursor'>X</p> {/* You can replace this with a delete button */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
