export default
class Figure {
  restore(stream) {
    this.resourceId = stream.readByte();
    this.useCrossCountry = stream.readByte(); // для стріл
    this.isFriendly = stream.readByte(); // свій/чужий, 1 = свій, 0 = чужий
    this.state = stream.readByte(); // живий/мертвий
    this.factionId = stream.readByte(); // свій/чужий, 1 = свій, 0 = чужий
    this.actionStateBeforeAttack = stream.readByte();
    this.direction = stream.readByte();
    this.previousTileDirection = stream.readByte();
    this.attackDirection = stream.readByte(); // якщо this.direction === FIGURE_DIRECTION_ATTACK
    this.position = { x: stream.readByte(), y: stream.readByte() };
    this.previousTile = { x: stream.readByte(), y: stream.readByte() };
    this.missileDamage = stream.readByte(); // для стріл
    this.damage = stream.readByte(); // для стріл
    this.gridOffset = stream.readShort(); // не використовується, прораховується на льоту, це зміщення в масиві карти
    this.destination = { x: stream.readByte(), y: stream.readByte() };
    this.destination.gridOffset = stream.readShort();
    this.source = {
      x: stream.readByte(),
      y: stream.readByte()
    };
    this.formationPosition = { // для війська
      x: stream.readByte(),
      y: stream.readByte(),
    };
    this.disallowDiagonal = stream.readShort(); // не буде використовуватись
    this.waitTicks = stream.readShort(); // затримка перед дією, наприклад, вбили людину, 120 тіків буде лежати труп, а потім зникне
    this.actionState = stream.readByte(); // константи FIGURE_ACTION_
    this.progressOnTile = stream.readByte(); // де саме на тайлі знаходиться спрайт
    this.routing_path_id = stream.readShort();
    this.routing_path_current_tile = stream.readShort();
    this.routing_path_length = stream.readShort();
    this.in_building_wait_ticks = stream.readByte();
    this.is_on_road = stream.readByte();
    this.max_roam_length = stream.readShort();
    this.roam_length = stream.readShort();
    this.roam_choose_destination = stream.readByte();
    this.roam_random_counter = stream.readByte();
    this.roam_turn_direction = stream.readByte();
    this.roam_ticks_until_next_turn = stream.readByte();
    this.crossCountry = {
      x: stream.readShort(),
      y: stream.readShort()
    };
    this.cc_destination_x = stream.readShort();
    this.cc_destination_y = stream.readShort();
    this.cc_delta_x = stream.readShort();
    this.cc_delta_y = stream.readShort();
    this.cc_delta_xy = stream.readShort();
    this.cc_direction = stream.readByte();
    this.speed_multiplier = stream.readByte();
    this.building_id = stream.readShort();
    this.immigrant_building_id = stream.readShort();
    this.destination_building_id = stream.readShort();
    this.formation_id = stream.readShort();
    this.index_in_formation = stream.readByte();
    this.formation_at_rest = stream.readByte();
    this.migrant_num_people = stream.readByte();
    this.is_ghost = stream.readByte();
    this.min_max_seen = stream.readByte();
    this.progress_to_next_tick = stream.readByte();
    this.leading_figure_id = stream.readShort();
    this.attack_image_offset = stream.readByte();
    this.wait_ticks_missile = stream.readByte();
    this.x_offset_cart = stream.readByte();
    this.y_offset_cart = stream.readByte();
    this.empire_city_id = stream.readByte();
    this.trader_amount_bought = stream.readByte();
    this.name = stream.readShort();
    this.terrain_usage = stream.readByte();
    this.loads_sold_or_carrying = stream.readByte();
    this.isBoat = stream.readByte();
    this.height_adjusted_ticks = stream.readByte();
    this.current_height = stream.readByte();
    this.target_height = stream.readByte();
    this.collecting_item_id = stream.readByte();
    this.trade_ship_failed_dock_attempts = stream.readByte();
    this.phrase_sequence_exact = stream.readByte();
    this.phrase_id = stream.readByte();
    this.phrase_sequence_city = stream.readByte();
    this.trader_id = stream.readByte();
    this.wait_ticks_next_target = stream.readByte();
    this.dont_draw_elevated = stream.readByte();
    this.target_figure_id = stream.readShort();
    this.targeted_by_figure_id = stream.readShort();
    this.created_sequence = stream.readShort();
    this.target_figure_created_sequence = stream.readShort();
    this.figures_on_same_tile_index = stream.readByte();
    this.num_attackers = stream.readByte();
    this.attacker_id1 = stream.readShort();
    this.attacker_id2 = stream.readShort();
    this.opponent_id = stream.readShort();
  }
}
