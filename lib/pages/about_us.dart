import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';

class AboutUs extends StatelessWidget {
  final PageController pageController;

  const AboutUs({super.key, required this.pageController});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("ABOUT US"),
        centerTitle: true,
        backgroundColor: const Color.fromRGBO(20, 78, 119, 1.0),
      ),
      body: SingleChildScrollView(
  child: Center(
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 0.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center, // Centramos horizontalmente
        children: <Widget>[
          const SizedBox(height: 18),
          GFImageOverlay(
            height: 120,
            width: 300,
            image: const AssetImage('assets/images/NEW_MEBN_LOGO.png'),
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.0),
              BlendMode.darken,
            ),
          ),
          const SizedBox(height: 10),
          GFImageOverlay(
            height: 20,
            width: 300,
            image: const AssetImage('assets/images/LOGO_letras_deg.png'),
            colorFilter: ColorFilter.mode(
              Colors.black.withOpacity(0.0),
              BlendMode.darken,
            ),
          ),
          const SizedBox(height: 40),
          const ListTile(
            title: Center(
              child: Text(
                "Description",
                style: TextStyle(
                  fontSize: 28.0,
                  fontWeight: FontWeight.bold,
                  color: Color.fromRGBO(20, 78, 119, 1.0),
                ),
              ),
            ),
            subtitle: Center(
              child: Text(
                "The unreached people are found in the ethnic and mountainous areas of any nation and it is due to the fact that the majority of its inhabitants have ancestral customs and practices and that they do not know the Bible and God's plan of salvation for men. In order to contribute to reverse this challenge, the Blessing to the Nations Ministry has as a strategy the formation and training of human resources, mainly from churches and evangelical.",
                style: TextStyle(
                  color: Color.fromRGBO(20, 78, 119, 1.0),
                ),
                textAlign: TextAlign.center, // Centramos el texto
              ),
            ),
          ),
          const ListTile(
            title: Center(
              child: Text(
                "Info:",
                style: TextStyle(
                  fontSize: 28.0,
                  color: Color.fromRGBO(20, 78, 119, 1.0),
                ),
              ),
            ),
            subtitle: Center(
              child: Text(
                "Email: blessingtothenations2002@gmail.com\nWebsite: https://xmaonline.com/",
                style: TextStyle(
                  color: Color.fromRGBO(20, 78, 119, 1.0),
                ),
                textAlign: TextAlign.center, // Centramos el texto
              ),
            ),
          ),
          const SizedBox(height: 100),
        ],
      ),
    ),
  ),
),

    );
  }
}
