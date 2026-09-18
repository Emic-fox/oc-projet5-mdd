package com.orion.mdd.auth.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.users.User;

/** Mapper MapStruct convertissant une entité {@link User} en {@link MeResponse}. */
@Mapper(componentModel = "spring")
public interface MeResponseMapper {

    /**
     * Convertit une entité utilisateur en réponse de profil exposable par l'API.
     *
     * @param user entité utilisateur source
     * @return le profil correspondant
     */
    MeResponse toMeResponse(User user);
}
