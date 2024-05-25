import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_nav_bar/google_nav_bar.dart';


class NavBar extends StatelessWidget {
  final int pageIndex;
  final Function(int) onTabChange;
  final PageController pageController;

  const NavBar({super.key, required this.pageIndex, required this.onTabChange, required this.pageController});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color.fromRGBO(20, 78, 119, 1.0),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 13.0, vertical: 6),
        child: GNav(
          backgroundColor: const Color.fromRGBO(20, 78, 119, 1.0),
          color: Colors.white,
          activeColor: Colors.white,
          tabBackgroundColor: const Color.fromRGBO(193, 70, 39, 1.0),
          gap: 2,
          selectedIndex: pageIndex,
          onTabChange: onTabChange,
          
          padding: const EdgeInsets.all(10),
          tabs:  [
            GButton(
              icon: Icons.home,
              text: "RECENT UPDATES",
              textStyle: GoogleFonts.fredoka(textStyle: const TextStyle(color: Color.fromARGB(255, 255, 255, 255))),              
            ),
            GButton(
              icon: Icons.favorite,
              text: "MINISTRIES",
              textStyle: GoogleFonts.fredoka(textStyle: const TextStyle(color: Color.fromARGB(255, 255, 255, 255))),              
            ),
            GButton(
              icon: Icons.auto_stories,
              text: 'ABOUT US',
              textStyle: GoogleFonts.fredoka(textStyle: const TextStyle(color: Color.fromARGB(255, 255, 255, 255))),              
            ),
            GButton(
              icon: Icons.settings,
              text: "SETTINGS",
              textStyle: GoogleFonts.fredoka(textStyle: const TextStyle(color: Color.fromARGB(255, 255, 255, 255))),              
            ),
          ],
        ),
      ),
    );
  }
}
