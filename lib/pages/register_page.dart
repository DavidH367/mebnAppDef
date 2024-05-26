import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:myapp/pages/login_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
// Define un método para navegar a la página de registro
  void navigateToLoginPage(BuildContext context) {
    Navigator.push(context, MaterialPageRoute(builder: (context) {
      return const LoginPage();
    }));
  }

  //text controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _churchController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmpasswordController = TextEditingController();
  String _selectedCountry = 'United States'; // Initial country code

  // Obtener el ID del usuario autenticado
  List<String> countryNames = [
    "United States",
    "China",
    "Honduras",
    "India",
    "Brazil",
    "Mexico",
    "Canada",
    "Australia",
    "United Kingdom",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Japan",
    "South Korea",
    "Russia",
    "Argentina",
    "Chile",
    "Peru",
    "Colombia",
    "Venezuela",
    "Ecuador",
    "Bolivia",
    "Uruguay",
    "Paraguay",
    "Saudi Arabia",
    "Egypt",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Ethiopia",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Sweden",
    "Norway",
    "Denmark",
    "Finland",
    "Poland",
    "Hungary",
    "Czech Republic",
    "Greece",
    "Turkey",
    "Israel",
    "UAE",
    "Qatar",
    "Kuwait",
    "Oman",
    "Singapore",
    "Malaysia",
    "Indonesia",
    "Philippines",
    "Thailand",
    "Vietnam",
    "Cambodia",
    "Myanmar",
    "Laos",
    "Bangladesh",
    "Pakistan",
    "Sri Lanka",
    "Nepal",
    "Bhutan",
    "Afghanistan",
    "Iraq",
    "Iran",
    "Syria",
    "Lebanon",
    "Jordan",
    "Cyprus",
    "Gibraltar",
    "Morocco",
    "Tunisia",
    "Algeria",
    "Libya",
    "Sudan",
    "Somalia",
    "Ukraine",
    "Belarus",
    "Moldova",
    "Romania",
    "Bulgaria",
    "Croatia",
    "Serbia",
    "Montenegro",
    "Bosnia and Herzegovina",
    "North Macedonia",
    "Kosovo",
    "Albania",
    "Azerbaijan",
    "Armenia",
    "Georgia",
    "Kazakhstan",
    "Uzbekistan",
    "Tajikistan",
    "Turkmenistan",
    "Kyrgyzstan",
  ];

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmpasswordController.dispose();
    super.dispose();
  }

   // Método para limpiar los campos de texto
  void clearFields() {
    _firstNameController.clear();
    _lastNameController.clear();
    _churchController.clear();
    _emailController.clear();
    _passwordController.clear();
    _confirmpasswordController.clear();
    setState(() {
      _selectedCountry = 'United States';
    });
  }

  Future signUp() async {
    //crea el usuario
    try {
      if (passwordConfirmed()) {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: _emailController.text.trim(),
          password: _passwordController.text.trim(),
        );

        //agregar coleccion
        addUserDetails(
          _firstNameController.text.trim(),
          _lastNameController.text.trim(),
          _churchController.text.trim(),
          _emailController.text.trim(),
        );
        // Limpiar los campos de texto
        clearFields();

      }
    } on FirebaseAuthException catch (e) {
      showDialog(
          context: context,
          builder: (context) {
            return AlertDialog(
              content: Text(e.message.toString()),
            );
          });
    }
  }

  Future addUserDetails(String firstName, String lastName, String churchName,
      String email) async {
    final user = FirebaseAuth.instance.currentUser!;
    final userId = user.uid;
    await FirebaseFirestore.instance.collection('usersmebn').doc(userId).set({
      "first_name": firstName,
      "last_name": lastName,
      "church_name": churchName,
      "user_Id": FirebaseAuth.instance.currentUser!.uid,
      "email": email
    });
  }

  bool passwordConfirmed() {
    if (_passwordController.text.trim() ==
        _confirmpasswordController.text.trim()) {
      return true;
    } else {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize:
            const Size.fromHeight(40.0), // Ajusta este valor según tu preferencia
        child: AppBar(
          title: const Text("REGISTER"),
          centerTitle: true,
          backgroundColor: const Color.fromRGBO(20, 78, 119, 1.0),
          titleTextStyle: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      backgroundColor: const Color.fromARGB(255, 233, 255, 227),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color.fromRGBO(197, 43, 4, 0.698),
              Color.fromRGBO(20, 78, 119, 0.5)
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  //logo
                  Image.asset(
                    'assets/images/NEW_MEBN_LOGO.png',
                    height: 110,
                    width: 300,
                  ),

                  const SizedBox(height: 15),

                  //Hola de nuevo
                  Text(
                    'Sing Up',
                    style: GoogleFonts.righteous(
                      fontSize: 48,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Register below with your details!',
                    style: TextStyle(
                      fontSize: 18,
                    ),
                  ),
                  const SizedBox(height: 30),

                  //first name textfield
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      controller: _firstNameController,
                      decoration: InputDecoration(
                        labelText: 'Your Name:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Daniel',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),

                  //last name textfield
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      controller: _lastNameController,
                      decoration: InputDecoration(
                        labelText: 'Your Last Name:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Hernandez',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),

                  //church name textfield
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      controller: _churchController,
                      decoration: InputDecoration(
                        labelText: 'Attending church:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Church',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),

                  //pais textfield
                  Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 25.0),
                      child: DropdownButtonFormField<String>(
                        value: _selectedCountry,
                        items: countryNames.map((String country) {
                          return DropdownMenuItem<String>(
                            value: country,
                            child: Text(country),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _selectedCountry = newValue ?? '';
                          });
                        },
                        decoration: InputDecoration(
                          labelText: 'Country:',
                          labelStyle: const TextStyle(color: Colors.black),
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          enabledBorder: OutlineInputBorder(
                            borderSide: const BorderSide(color: Colors.white),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: const BorderSide(
                                color: Color.fromARGB(255, 218, 214, 28)),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          hintText: 'Country',
                          fillColor: const Color.fromARGB(255, 255, 255, 255),
                          filled: true,
                        ),
                      )),

                  const SizedBox(height: 25),

                  //correo textfield
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        labelText: 'Your E-mail:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'example@mail.com',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),
                  //contrasena
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      obscureText: true,
                      controller: _passwordController,
                      decoration: InputDecoration(
                        labelText: 'Secure Password:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'password',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),

                  const SizedBox(height: 25),
                  //confirmar contrasena
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: TextField(
                      obscureText: true,
                      controller: _confirmpasswordController,
                      decoration: InputDecoration(
                        labelText: 'Confirm your Secure Password:',
                        labelStyle: const TextStyle(color: Colors.black),
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        enabledBorder: OutlineInputBorder(
                          borderSide: const BorderSide(color: Colors.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                              color: Color.fromARGB(255, 218, 214, 28)),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'password',
                        fillColor: const Color.fromARGB(255, 255, 255, 255),
                        filled: true,
                      ),
                    ),
                  ),
                  const SizedBox(height: 30),

                  //boton de registro
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: GestureDetector(
                      onTap: signUp,
                      child: Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: const Color.fromRGBO(20, 78, 119, 1.0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Center(
                            child: Text(
                          'Sing Up',
                          style: TextStyle(
                            color: Color.fromARGB(255, 255, 255, 255),
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        )),
                      ),
                    ),
                  ),

                  const SizedBox(height: 60),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
