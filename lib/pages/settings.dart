import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class SettingsPage extends StatefulWidget {
  final PageController pageController;
  final Future<void> Function() signOut; // Añade un parámetro para signOut aquí

  const SettingsPage(
      {super.key, required this.pageController, required this.signOut});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  final user = FirebaseAuth.instance.currentUser!;

  @override
  Widget build(BuildContext context) {
    //var localizationDelegate = LocalizedApp.of(context).delegate;
    return Scaffold(
      appBar: AppBar(
        title: const Text("Settings"),
        centerTitle: true,
        backgroundColor: const Color.fromRGBO(20, 78, 119, 1.0),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: <Widget>[
            
            const Padding(
              padding: EdgeInsets.only(top: 20.0), // Ajustar el padding
              child: Text('Settings Page Content'),
            ),
            Expanded(
              child: Container(),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: ElevatedButton(
                onPressed: () async {
                  FirebaseAuth.instance.signOut();
                },
                child: const Text('Sign Out'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}


