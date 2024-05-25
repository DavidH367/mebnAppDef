import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:getwidget/getwidget.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

// Variables para almacenar los valores del título y la descripción
String titleText = '';
String descriptionText = '';

class FavoriteIcon extends StatefulWidget {
  const FavoriteIcon({super.key});

  @override
  _FavoriteIconState createState() => _FavoriteIconState();
}

class _FavoriteIconState extends State<FavoriteIcon> {
  bool _isFavorite = false;

  @override
  Widget build(BuildContext context) {
    return IconButton(
      icon: Icon(
        _isFavorite ? Icons.favorite : Icons.favorite_border,
        color: _isFavorite ? Colors.red : null,
      ),
      onPressed: () {
        setState(() {
          _isFavorite = !_isFavorite;
        });
      },
    );
  }
}

class HomePage extends StatelessWidget {
  final PageController pageController;

  const HomePage({super.key, required this.pageController});

  @override
  Widget build(BuildContext context) {
    Future<QuerySnapshot<Map<String, dynamic>>> fetchLatestNews() {
      return FirebaseFirestore.instance
          .collection('news')
          .orderBy('date', descending: true)
          .get();
    }

    final Widget emptyBlock = Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: MediaQuery.of(context).size.width * 0.9,
            height: 100,
            color: Colors.white,
          ),
          const SizedBox(height: 8), // Agrega un espacio entre los contenedores
          Container(
            width: MediaQuery.of(context).size.width * 0.5,
            height: 8,
            color: Colors.white,
          ),
        ],
      ),
    );

    return Scaffold(
      appBar: PreferredSize(
        preferredSize:
            const Size.fromHeight(40.0), // Ajusta este valor según tu preferencia
        child: AppBar(
          title: const Text("RECENT UPDATES"),
          centerTitle: true,
          backgroundColor: const Color.fromARGB(255, 20, 78, 119),
          titleTextStyle: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                const SizedBox(height: 8),
                LayoutBuilder(
                  builder: (context, constraints) {
                    return GFImageOverlay(
                      height: 150,
                      width: constraints.maxWidth,
                      image: const AssetImage('assets/images/NEW_MEBN_LOGO.png'),
                      colorFilter: ColorFilter.mode(
                        Colors.black.withOpacity(0.0),
                        BlendMode.darken,
                      ),
                    );
                  },
                ),
                FutureBuilder<QuerySnapshot<Map<String, dynamic>>>(
                  future: fetchLatestNews(),
                  builder: (BuildContext context,
                      AsyncSnapshot<QuerySnapshot<Map<String, dynamic>>>
                          snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const CircularProgressIndicator();
                    } else {
                      if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                      } else {
                        return Column(
                          children: snapshot.data!.docs.map((doc) {
                            // Obtener los datos del documento
                            String titleText = doc['new_title'];
                            String descriptionText = doc['description'];
                            List<String> imageUrls = [
                              doc['images']['url1'],
                              doc['images']['url2'],
                              doc['images']['url3'],
                            ];

                            // Construir la tarjeta con los datos obtenidos
                            return GFCard(
                              boxFit: BoxFit.cover,
                              titlePosition: GFPosition.start,
                              title: GFListTile(
                                titleText: titleText,
                                icon: const FavoriteIcon(),
                              ),
                              content: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  CarouselSlider(
                                    options: CarouselOptions(
                                      height: 200,
                                      enlargeCenterPage: true,
                                      autoPlay: true,
                                      aspectRatio: 16 / 9,
                                      autoPlayCurve: Curves.fastOutSlowIn,
                                      enableInfiniteScroll: true,
                                      autoPlayAnimationDuration:
                                          const Duration(milliseconds: 1100),
                                      viewportFraction: 1.0,
                                    ),
                                    items: imageUrls.map((imageUrl) {
                                      return Builder(
                                        builder: (BuildContext context) {
                                          return Container(
                                            width: MediaQuery.of(context)
                                                .size
                                                .width,
                                            margin: const EdgeInsets.symmetric(
                                                horizontal: 5.0),
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(4.0),
                                              image: DecorationImage(
                                                image: NetworkImage(imageUrl),
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          );
                                        },
                                      );
                                    }).toList(),
                                  ),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 8.0, horizontal: 6.0),
                                    child: Text(
                                      descriptionText,
                                      style: const TextStyle(fontSize: 14.0),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        );
                      }
                    }
                  },
                ),
                const SizedBox(height: 1),
                GFShimmer(
                  child: emptyBlock,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
