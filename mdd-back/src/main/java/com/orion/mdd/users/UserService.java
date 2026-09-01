package com.orion.mdd.users;

public interface UserService {

    User loadUserByEmailOrUsername(String emailOrUsername);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    User create(User user);
}
