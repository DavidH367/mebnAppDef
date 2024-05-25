import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

// Variables para almacenar los valores del título y la descripción
String titleText = '';
String descriptionText = '';
String mision = '';
String vision = '';
int budget = 0;

class Ministries extends StatelessWidget {
  final PageController pageController;

  const Ministries({super.key, required this.pageController});

  Future<QuerySnapshot<Map<String, dynamic>>> fetchLatestNews() {
    return FirebaseFirestore.instance
        .collection('ministries')
        .orderBy('date', descending: true)
        .get();
  }

  @pragma('vm:entry-point')
  static Route<Object?> _dialogBuilder(
      BuildContext context, Object? arguments) {
    final Map<String, dynamic> data = arguments as Map<String, dynamic>;
    return DialogRoute<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            data['ministry_name'],
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                const Text(
                  'Description:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  data['description'],
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Mission:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  data['mision'],
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 10),
                const Text(
                  'Vision:',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  data['vision'],
                  style: const TextStyle(
                    fontSize: 16,
                    color: Colors.black54,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'Budget: \$${data['budget']}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                )
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              style: TextButton.styleFrom(
                textStyle: Theme.of(context).textTheme.labelLarge,
              ),
              child: const Text('Close'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(
            40.0), // Ajusta este valor según tu preferencia
        child: AppBar(
          title: const Text("MINISTRIES"),
          centerTitle: true,
          backgroundColor: const Color.fromRGBO(20, 78, 119, 1.0),
          titleTextStyle: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FutureBuilder<QuerySnapshot<Map<String, dynamic>>>(
              future: fetchLatestNews(),
              builder: (BuildContext context,
                  AsyncSnapshot<QuerySnapshot<Map<String, dynamic>>> snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                } else {
                  if (snapshot.hasError) {
                    return Text('Error: ${snapshot.error}');
                  } else {
                    List<Widget> newsCards =
                        []; // Create an empty list to hold widgets
                    for (var doc in snapshot.data!.docs) {
                      String titleText = doc['ministry_name'];
                      String descriptionText = doc['description'];
                      String mision = doc['mision'];
                      String vision = doc['vision'];
                      budget = doc['budget'];

                      // Create the ListTile widget outside the loop
                      newsCards.add(
                        Card(
                          elevation: 12,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20.0),
                          ),
                          color: const Color.fromARGB(255, 20, 78, 119),
                          child: Column(
                            children: [
                              ClipRRect(
                                borderRadius: const BorderRadius.only(
                                  topRight: Radius.circular(20),
                                  topLeft: Radius.circular(20),
                                ),
                                child: Image.network(
                                  doc['logo_url'],
                                  height: 400,
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                ),
                              ),
                              ListTile(
                                title: Text(titleText),
                                subtitle: Text(
                                  descriptionText,
                                  style: const TextStyle(
                                    color: Color.fromARGB(255, 214, 213, 213),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 10,
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: OutlinedButton(
                                        onPressed: () {
                                          Navigator.of(context).push(
                                            _dialogBuilder(
                                              context,
                                              {
                                                'ministry_name': titleText,
                                                'description': descriptionText,
                                                'mision': mision,
                                                'vision': vision,
                                                'budget': budget,
                                              },
                                            ),
                                          );
                                        },
                                        child: const Text(
                                          "Learn More",
                                          style: TextStyle(
                                            color: Color.fromARGB(
                                                255, 255, 255, 255),
                                            fontSize: 20,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }

                    return Column(
                        children: newsCards); // Return the list of widgets
                  }
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
