"use client";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
export interface userProp {
  name: string;
  email:string;
  src?:string
}
const users = [
  {
    name:"Nikhil",
    email:"nikhilpal@gmail.com",
    src:"",
  },
  {
    name:"Aryan bakasur",
    email:"hhjkh@dsadadasdj.com",
    src:""
  },
  {
    name:"Raja bakasur",
    email:"raha@juj.com",
    src:""
  },
];

export default function Home() {
  const defaultUser = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" id="user">
  <path d="M256 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96z"></path>
</svg>

  const inputRef = useRef<HTMLInputElement>(null); // Provide an initial value with HTMLInputElement
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<userProp[]>([]);
  console.log("selectedUsers:", selectedUsers)
  const [listUsers, setListUsers] = useState([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const [lastHighlighted, setLastHighlighted] = useState(false)
  const [filteredItems, setFilteredItems] = useState<userProp[]>(users)

  const handleInputClick = () => {
    // Set the state to show the list
    setIsListVisible(true);

    // Focus on the input field
    inputRef.current?.focus(); // Use optional chaining to handle potential null/undefined
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setFilteredItems(users.filter(item => !selectedUsers.find(chip => chip === item)));
    } else {
      setFilteredItems(users.filter(item => item.name.toLowerCase().includes(value.toLowerCase())));
    }
  };

  const handleBlur = () => {
    // Set the state to hide the list when the input loses focus
    setIsListVisible(false);
  };

  const handleInputKeyDown = (e:any) => {
    if (e.key === "Backspace" && inputValue === "" && selectedUsers.length > 0 && lastHighlighted === true) {
      // Handle Backspace key when input is empty
      const lastUser = selectedUsers[selectedUsers.length - 1];
      
      // Implement your logic here (e.g., remove the last user)
      setFilteredItems((prevUsers) => [...prevUsers, lastUser])
      setSelectedUsers(selectedUsers.slice(0, -1));
      setLastHighlighted(false);
    }
    else if(e.key === "Backspace" && inputValue === "" && selectedUsers.length > 0 && lastHighlighted === false)
    {
      setLastHighlighted(true)
    }
  };
  const addSelectedUsers = (user:userProp) => {
    console.log("user:", user)
    setFilteredItems(filteredItems.filter((filtereduser)=>(filtereduser.email !== user.email)))
    setSelectedUsers((prevUsers) => [...prevUsers, user]);
  }
  const removeUser = (user:userProp)=>{
    setSelectedUsers(selectedUsers.filter((suser)=>(suser.email !== user.email)));
    setFilteredItems((prevUsers) => [...prevUsers, user])
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-2xl">Pick Users</div>
      <div className="flex border-b-2	border-sky-500 min-w-full">
        {selectedUsers.map((user, index) => (
          // <Chip user={user} name={user.name} key={index} isLast={index === selectedUsers.length - 1 && lastHighlighted} />
          <div key={index} className={`flex text-sm min-w-36 justify-around px-2 items-center bg-slate-200
        rounded-full ${index === selectedUsers.length - 1 && lastHighlighted === true ? "border border-sky-800 ":""} `}>
            <div>{user.name}</div>
            &nbsp;
            <div className='flex justify-end'>
                <button className='hover:bg-slate-300 rounded-full justify-center min-w-4' 
                onClick={()=>removeUser(user)}>x</button>
            </div>
        </div>
        ))}
        <div className="relative min-w-full">
          <input
            type="text"
            ref={inputRef}
            onClick={handleInputClick}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleBlur}
            value={inputValue}
            name="email"
            className="mt-1 px-3 py-2 bg-white focus:outline-none block rounded-md sm:text-sm w-full"
            placeholder="Add new user..."
          />
          <div className="absolute -bottom-60 left-0 bg-slate-50 shadow-md list-none min-h-60 max-h-60">
            {isListVisible && (
              filteredItems.map((user) => (
                <li key={user.name} className="p-2 cursor-pointer hover:bg-slate-300 min-w-96" 
                onMouseDown={() => {
                  addSelectedUsers(user);
                  handleInputClick(); // Manually trigger handleInputClick
                }}>
                  <div className="flex justify-start">
                    <div className="flex p-2">
                      <div>{user.src ? <Image src={user.src} alt="" />: defaultUser}</div>
                      <div className="mx-2">{user.name}</div>
                    </div>
                    <div className="flex justify-start items-start text-slate-500 p-2 ml-4">{user.email}</div>
                  </div>
                </li>
              )
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
