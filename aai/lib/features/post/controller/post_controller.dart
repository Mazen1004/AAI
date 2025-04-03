import 'dart:io';
import 'dart:typed_data';

import 'package:aai/core/providers/storage_repository_provider.dart';
import 'package:aai/core/utils.dart';
import 'package:aai/features/auth/controller/auth_controller.dart';
import 'package:aai/features/post/repository/post_repository.dart';
import 'package:aai/models/post_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:routemaster/routemaster.dart';

final postControllerProvider = StateNotifierProvider<PostController, bool>((ref) {
  final postRepository = ref.watch(postRepositoryProvider);
  final storageRepository = ref.watch(storageRepositoryProvider);
  return PostController(
    postRepository: postRepository,
    storageRepository: storageRepository,
    ref: ref,
  );
});

final userPostsProvider = StreamProvider((ref) {
  final postController = ref.watch(postControllerProvider.notifier);

  return postController.fetchUserPosts();
});

class PostController extends StateNotifier<bool> {
  final PostRepository _postRepository;
  final Ref _ref;
  final StorageRepository _storageRepository;
  PostController({
    required PostRepository postRepository,
    required Ref ref,
    required StorageRepository storageRepository,
  })  : _postRepository = postRepository,
        _ref = ref,
        _storageRepository = storageRepository,
        super(false);

        void shareTextPost({
          required BuildContext context,
          required String title,
          required String description,
        }) async {
          state = true;
          String postId = title;
          final user = _ref.read(userProvider)!;

          final Post post = Post(id: postId, title: title, upvotes: [], downvotes: [], commentCount: 0, username: user.name, uid: user.uid, type: 'text', createdAt: DateTime.now(), description: description);

          final res = await _postRepository.addPost(post);
          state = false;
          res.fold((l) => showSnackBar(context, l.message), (r) {
            showSnackBar(context, 'Posted successfully!');
            Routemaster.of(context).pop();
          });
        }

        void shareLinkPost({
          required BuildContext context,
          required String title,
          required String link,
        }) async {
          state = true;
          String postId = title;
          final user = _ref.read(userProvider)!;

          final Post post = Post(id: postId, title: title, upvotes: [], downvotes: [], commentCount: 0, username: user.name, uid: user.uid, type: 'link', createdAt: DateTime.now(), link: link);

          final res = await _postRepository.addPost(post);
          state = false;
          res.fold((l) => showSnackBar(context, l.message), (r) {
            showSnackBar(context, 'Posted successfully!');
            Routemaster.of(context).pop();
          });
        }

        void shareImagePost({
          required BuildContext context,
          required String title, 
          required File? file,
          required Uint8List? webfile
        }) async {
          state = true;
          String postId = title;
          final user = _ref.read(userProvider)!;
          final imageRes = await _storageRepository.storeFile(path: 'posts', id: postId, file: file, webFile: webfile);

          imageRes.fold((l) => showSnackBar(context, l.message), (r) async {
            final Post post = Post(id: postId, title: title, upvotes: [], downvotes: [], commentCount: 0, username: user.name, uid: user.uid, type: 'image', createdAt: DateTime.now(), link: r);

            final res = await _postRepository.addPost(post);
            state = false;
            res.fold((l) => showSnackBar(context, l.message), (r) {
              showSnackBar(context, 'Posted successfully!');
              Routemaster.of(context).pop();
            });
          });

          
        }

  Stream<List<Post>> fetchUserPosts() {
    return _postRepository.fetchUserPosts(); // may give error if empty; timestamp 6:46 if need to fix
  }
}