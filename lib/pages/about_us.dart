import 'package:flutter/material.dart';

class AboutUs extends StatelessWidget {
  final PageController pageController;

  const AboutUs({super.key, required this.pageController});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('About Us Page Content'),
          ],
        ),
      ),
    );
  }
}
