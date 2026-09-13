package com.orion.mdd.users;

public interface UserService {

    User loadUserByEmailOrUsername(String emailOrUsername);

    User loadById(Long id);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmailAndNotId(String email, Long id);

    boolean existsByUsernameAndNotId(String username, Long id);

    User create(User user);
}
