import 'package:aai/core/utils.dart';
import 'package:aai/features/auth/repository/auth_repository.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:aai/models/user_model.dart';
import 'package:firebase_auth/firebase_auth.dart';

final userProvider = StateProvider<UserModel?>((ref) => null);

final authControllerProvider = StateNotifierProvider<AuthController, bool>((ref) => AuthController(
  AuthRepository: ref.watch(AuthRepositoryProvider),
  ref: ref,
  ),
);

final authStateChangeProvider = StreamProvider((ref) {
  final authController = ref.watch(authControllerProvider.notifier);
  return authController.authStateChange;
});

final getUserDataProvider = StreamProvider.family((ref, String uid) {
  final authController = ref.watch(authControllerProvider.notifier);
  return authController.getUserData(uid); 
});

class AuthController extends StateNotifier<bool> {
  final AuthRepository _authRepository;
  final Ref _ref;
  AuthController({
    required AuthRepository AuthRepository, 
    required Ref ref,
  }):
  _authRepository = AuthRepository,
  _ref = ref,
  super(false);

  Stream<User?> get authStateChange => _authRepository.authStateChange;

  void signInWithGoogle(BuildContext context) async {
    state = true;
    final user = await _authRepository.signInWithGoogle();
    state = false;
    user.fold((l) => showSnackBar(context, l.message), 
    (userModel) => _ref.read(userProvider.notifier).update((state) => userModel));
  }


  Stream<UserModel> getUserData(String uid) {
    return _authRepository.getUserData(uid);
  }
}