/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react"
import DefaultLayout from "./pages/admin/layout/DefaultLayout"
import Loader from "./loader/Loader";
import SignIn from "./pages/Authentication/SignIn";

function App() {
  const [loading, setLoading] =useState(true);
  useEffect(()=>{
    setTimeout(()=> setLoading(false), 1000)
  },[])
  // return loading ?
  //   (<Loader />): (
  //     <>
  //       <DefaultLayout />
  //     </>
  //   ) 
  return (
    <SignIn />
  )
}

export default App
