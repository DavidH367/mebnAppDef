import React from "react";
import {Image} from "@nextui-org/react";

export default function Logo() {
    return (
        <Image
            alt="Card background"
            className="object-cover rounded-xl w-full h-full"
            src="../img/logo_paginas.png"
            width={61}
            height={61}
        />
    );
};
