import { useRouter } from "next/router";
import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const MenuOption = ({
    optionTitle,
    optionIcon,
    optionLink
}) => {
    const router = useRouter()
    return (
        <Card 
        className="mediaCard w-full h-[300px] col-span-12 sm:col-span-5"
        variant="bordered"
        isFooterBlurred
        isPressable
        isHoverable
        borderWeight="bold"
        placeholder="blur"
        blurDataURL={"/logo-liga-contra-cancer.png"}
        onPress={()=>{router.push(optionLink)}}
        >
            <Image
                removeWrapper
                src={optionIcon}
                className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
                alt={`${optionTitle} icon`}
            />
            <CardFooter 
            isBlurred
            className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between"
            >
                <h4 
                className="text-white font-medium text-large"
                style={{
                    color:"$accents0",
                    textShadow: '0.1px 0.5px 5px rgb(45, 62, 80)',
                    textAlign:"center",
                    fontSize:"$2xl",
                    display: "block",
                    margin: "0 auto",
                    "@media(max-width: 968px)":{
                        fontSize:"$xl",
                    },
                    "@media(max-width: 768px)":{
                        fontSize:"$md",
                        
                    }
                }}>{optionTitle}</h4>
            </CardFooter>
        </Card>
    );
}

export default MenuOption;