import 'dart:io';

import 'package:aai/core/constants/constants.dart';
import 'package:aai/core/utils.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AddPostTypeScreen extends ConsumerStatefulWidget {
  final String type;
  const AddPostTypeScreen({
    super.key,
    required this.type
  });

  @override
  ConsumerState<ConsumerStatefulWidget> createState() => _AddPostTypeScreenState();
}

class _AddPostTypeScreenState extends ConsumerState<AddPostTypeScreen> {
  final titleController = TextEditingController();
  final descriptionController = TextEditingController();
  final linkController = TextEditingController();
  File? bannerFile;
  File? bannerWebFile;

  @override
  void dispose() {
    super.dispose();
    titleController.dispose();
    descriptionController.dispose();
    linkController.dispose();
  }

  void selectBannerImage() async {
    final res = await pickImage();

    if (res != null) {
      if (kIsWeb) {
        setState(() {
          bannerWebFile = res.files.first.bytes;
        });
      } else {
        setState(() {
          bannerFile = File(res.files.first.path!);
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isTypeImage = widget.type == 'image';
    final isTypeText = widget.type == 'text';
    final isTypeLink = widget.type == 'link';

    
    return Scaffold(
      appBar: AppBar(
        title: Text('Post ${widget.type}'),
        actions: [TextButton(onPressed: () {}, child: const Text('Share'))]
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column( 
          children: [
            TextField(
              controller: titleController,
              decoration: const InputDecoration(
                filled: true,
                hintText: 'Enter Title here',
                border: InputBorder.none,
                contentPadding: EdgeInsets.all(18),
              ),
              maxLength: 30,
            ),
            const SizedBox(height: 10),
            if(isTypeImage) 
              GestureDetector(
                    onTap: selectBannerImage,
                    child: DottedBorder(
                      borderType: BorderType.RRect,
                      radius: const Radius.circular(10),
                      dashPattern: const [10, 4],
                      strokeCap: StrokeCap.round,
                      color: Colors.white,
                      child: Container(
                        width: double.infinity,
                        height: 150,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: bannerWebFile != null
                            ? Image.memory(bannerWebFile!)
                            : bannerFile != null
                                ? Image.file(bannerFile!)
                                : const Center(
                                        child: Icon(
                                          Icons.camera_alt_outlined,
                                          size: 40,
                                        ),
                                      )
                      ),
                    ),
                  ),

            if(isTypeText)
              TextField(
                controller: descriptionController,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Enter description here',
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(18),
                ),
                maxLines: 15,
              ),
            if(isTypeLink)
              TextField(
                controller: linkController,
                decoration: const InputDecoration(
                  filled: true,
                  hintText: 'Enter link here',
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(18),
                ),
              ),
              const SizedBox(height: 5),
          ],
        ),
      )
    );
  }
}