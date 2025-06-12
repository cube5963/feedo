import { NoEncryption } from "@mui/icons-material";
import {
    Button,
} from "@mui/material";

export default function NewProject(){
    return(
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                margin: "20px auto",
                marginTop:"30px",
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
            }}>
            <h1>新規作成</h1>
            <h3>AIを使用しますか？</h3>
            <div style = {{display:"flex",marginTop:"20px",gap:"200px"}}>
                <Button href="/setup" variant="contained"
                style = {{width:"120px",height:"80px",fontWeight:"bold"}}>使用します</Button>
                <Button variant="outlined" color="inherit"
                style = {{width:"120px",height:"80px",fontWeight:"bold"}}>使用しません</Button>
            </div>
        </div>
    );
}
