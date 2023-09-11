import axios from "axios";

const reorderIssuesApi = async(data:ReorderIssue)=>{
    const response = await axios.put('/api/issues',data);
    return response.data;
}