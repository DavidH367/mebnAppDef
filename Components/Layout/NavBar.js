import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../lib/context/AuthContext";

import {
  Avatar,
  Dropdown,
  Navbar as NextUINavbar,
  Text,
  Link,
  Button,
  Modal,
} from "@nextui-org/react";

export default function NavBar() {
  
  return <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
      </label>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li><a>Inicio</a></li>
        <li>
          <Link href= "../purchasing" color="secondary">
            Compras
          </Link>
        </li>
        <li>
        <Link href="../sales" >
          Ventas
        </Link>
        </li>
        <li>
        <Link href="../supliers" >
          Inversionistas
        </Link>
        </li>
        <li>
          <Link href="../intake_control" >
            Control de Ingreso de Cafe
          </Link>
        </li>
        <li>
          <Link href="../intake_control" >
            Control de Ganacia y Rendimiendo
          </Link>
        </li>
      </ul>
    </div>
    <a className="btn btn-ghost normal-case text-xl">G-Café</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li><a>Inicio</a></li>
      <li className ="compra compra-accent" >
        <Link href="../purchasing" >
          Compras
        </Link>
      </li>
      <li>
        <Link href="../sales" >
          Ventas
        </Link>
      </li>
      <li>
      <Link href="../supliers" >
          Inversionistas
      </Link>
      </li>
      <li>
      <Link href="../intake_control" >
        Control de Ingreso de Cafe
      </Link>
      </li>
      <li>
        <Link href="../intake_control" >
          Control de Ganacia y Rendimiendo
        </Link>
      </li>
      
    </ul>
  </div>
  <div className="navbar-end">
  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-20 rounded-full">
          <img src="../img/perfil.jpg" />
        </div>
      </label>
  </div>
</div>
}