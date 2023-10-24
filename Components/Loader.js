import { Spinner} from "@nextui-org/react";
import Image from "next/image";
const Loader = () => {
    return (
        <div style={{
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            height:"90vh",
            padding:"$0"
        }}>
            <Image src="/img/logo_principal.png"
            height={220}
            width={220}
            alt="logo"/>
            <Spinner
            css={{marginTop:"$10"}} 
            color={"warning"} 
            size="xl"/>
        </div>
    );
}

export default Loader;