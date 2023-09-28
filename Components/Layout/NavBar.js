import React from "react";
import { Link, Button } from "@nextui-org/react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { text: "Resumen", url: "../" },
    { text: "Compras", url: "/purchasing" },
    { text: "Ventas", url: "/sales" },
    { text: "Proveedores", url: "/supliers" },
    { text: "Consultas", url: "/searches" },
    
    
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">BODEGA - GAD</p>
        </NavbarBrand>

      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="../">
            Resumen
          </Link>
        </NavbarItem>
        <NavbarItem >
          <Link href="/purchasing" color="foreground" aria-current="page">
            Compras
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/sales">
            Ventas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/supliers">
            Proveedores
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/searches">
          Consultas
          </Link>
        </NavbarItem>
        
      </NavbarContent>


      <NavbarContent justify="end">

      </NavbarContent>


      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.text}-${index}`}>
            <Link
              color={
                index === 0 ? "primary" : index === menuItems.length - 0 ? "normal" : "foreground"
              }
              className="w-full"
              href={item.url}
              size="lg"
            >
              {item.text}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavBar;