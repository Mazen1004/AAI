import 'package:aai/features/auth/repository/auth_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final authControllerProvider = Provider((ref) => AuthController(
  AuthRepository: ref.read(AuthRepositoryProvider),
  ),
);
class AuthController {
  final AuthRepository _authRepository;
  AuthController({
    required AuthRepository AuthRepository
  }):
  _authRepository = AuthRepository;

  void signInWithGoogle(){
    _authRepository.signInWithGoogle();
  }
}