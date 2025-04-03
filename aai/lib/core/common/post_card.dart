import 'package:aai/models/post_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PostCard extends ConsumerWidget {
  final Post post;
  const PostCard({
    super.key, 
    required this.post
    });

    @override
    Widget build(BuildContext context, WidgetRef ref) {
      final isTypeImage = post.type == 'image';
      final isTypeText = post.type == 'text';
      final isTypeLink = post.type == 'link';

      return Column(
      );
    }
}