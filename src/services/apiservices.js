import axios from "axios";

export const cstream = (payload)=>{
    
return axios.post("http://127.0.0.1:8080/proxy/create", payload).then((res)=>{
    return res;
})
}

export const dstream = (deleteRequest)=>{
    console.log(deleteRequest);
    return axios.post("http://127.0.0.1:8080/proxy/delete", deleteRequest).then((res)=>{
        return res;
    })
} 

export const rstream = (renameRequest)=>{
    console.log(renameRequest);
    return axios.post("http://127.0.0.1:8080/proxy/rename", renameRequest).then((res)=>{
        return res;
    })
}