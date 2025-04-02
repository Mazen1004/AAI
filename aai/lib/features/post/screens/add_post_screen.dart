import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:routemaster/routemaster.dart';

class AddPostScreen extends ConsumerWidget {
  const AddPostScreen({super.key});

  void navigateToType(BuildContext context, String type) {
    Routemaster.of(context).push('/add-post/$type');
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
      double cardheightWidth = 120;
      double iconSize = 60;

      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
        GestureDetector(
          onTap: () => navigateToType(context,'image'),
          child: SizedBox( 
          height: cardheightWidth, 
          width: cardheightWidth, 
          child: Card(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10),),
        elevation: 16,
        child: Center(
          child: Icon(Icons.image_outlined, 
          size: iconSize,),
          ),
        ),
          ),
        ),

        GestureDetector(
          onTap: () => navigateToType(context,'text'),
          child: SizedBox( 
          height: cardheightWidth, 
          width: cardheightWidth, 
          child: Card(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10),),
          elevation: 16,
          child: Center(
          child: Icon(Icons.font_download_outlined, 
          size: iconSize,),
          ),
        ),
          ),
        ),

        GestureDetector(
          onTap: () => navigateToType(context,'link'),
          child: SizedBox( 
          height: cardheightWidth, 
          width: cardheightWidth, 
          child: Card(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10),),
        elevation: 16,
        child: Center(
          child: Icon(Icons.link_outlined, 
          size: iconSize,),
          ),
        ),
          ),
        )
      ],
      );
    }
  }
