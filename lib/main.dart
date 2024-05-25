import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'components/nabvar.dart';
import 'package:myapp/pages/about_us.dart';
import 'package:myapp/pages/home_page.dart';
import 'package:myapp/pages/login_page.dart';
import 'package:myapp/pages/ministries_page.dart';
import 'package:myapp/pages/settings.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );


  runApp(
    MaterialApp(
      home: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  final PageController _pageController = PageController();

  MyApp({super.key});

  Future<void> signOut() async {
    await FirebaseAuth.instance.signOut();
  }

   @override
  Widget build(BuildContext context) {

    return MaterialApp(
        home: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (BuildContext context, AsyncSnapshot<User?> snapshot) {
          if (snapshot.hasData) {
            // Si hay un usuario autenticado, muestra la página principal
            return Scaffold(
              body: PageView(
                physics: const NeverScrollableScrollPhysics(), // Deshabilita el deslizamiento
                controller: _pageController,
                children: [
                  HomePage(
                    pageController: _pageController,
                  ),
                  Ministries(
                    pageController: _pageController,
                  ),
                  AboutUs(
                    pageController: _pageController,
                  ),
                  SettingsPage(pageController: _pageController, signOut: signOut),

                  // ... otras páginas
                ],
              ),
              bottomNavigationBar: NavBar(
                pageIndex: 0, // Establece el índice inicial según sea necesario
                onTabChange: (index) {
                  // Maneja el cambio de pestaña según sea necesario
                  _pageController.animateToPage(index,
                      duration: const Duration(milliseconds: 300), curve: Curves.ease);
                },
                pageController: _pageController,
              ),
            );
          } else {
            // Si no hay un usuario autenticado, muestra la página de inicio de sesión
            return const LoginPage();
          }
        },
      ),
    );
  }
}
