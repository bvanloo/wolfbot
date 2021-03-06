/*
  Usage: 

  /jsp summon
  /jsp dismiss
  /jsp come
  /jsp stay
  /jsp pack
*/
var _store = {players: {}};

var bot = plugin('bot',{
	/* helper methods for a player's bot */
    get_bot: function(player){
        return _store.players[player.name];
    },
    set_bot: function(player,bot,inventory){
        _store.players[player.name] = {bot:bot,inventory:inventory};
    },

    /* display the commands and what they do */
	help: function(){
		self.sendMessage("Wolfbot Help Menu: Available Commands \n\n");
		self.sendMessage("Summon: Summons a new wolfbot \n");
		self.sendMessage("Dismiss: Dismisses your wolfbot \n");
		self.sendMessage("Stay: Tells your wolfbot to stay \n");
		self.sendMessage("Come: Tells your wolfbot to come \n");
		self.sendMessage("Pack: Displays the inventory of your wolfbot's pack \n");
	},

    /* summons your bot */
    summon: function(player){
        var world  = player.world
        
        // in case you already have one spawned
        this.dismiss(player);
        
        // place wolf two squares in front of you
        var my_bot = world.spawnCreature(player.getLocation().add(0,0,2), org.bukkit.entity.EntityType.WOLF);
        
        my_bot.setTamed(true);
        my_bot.setOwner(player);
        my_bot.setTarget(player);
        
        var inventory; 
        var b = this.get_bot(player);
        if(b == null || b.inventory == null)
            inventory = player.getServer().createInventory(player, 36, "Bot's Pack");
        else
            inventory = b.inventory;
        
        this.set_bot(player,my_bot,inventory);
    },
    /* dismisses your bot */
    dismiss: function(player){
        var b = this.get_bot(player);
        if( b != null && b.bot !== null){
            b.bot.remove();
            b.bot = null;
        }
    },
    /* instructs your bot to stay */
    stay: function(player){
        var b = this.get_bot(player);
        if(b!= null && b.bot !== null){
            b.bot.setTarget(null);
            b.bot.setSitting(true);
        }
    },
    /* instructs your bot to follow you */
    come: function(player){
        var b = this.get_bot(player);
        if(b!= null){
            b.bot.setSitting(false);
            b.bot.setTarget(player);
        }
    },
    /* instructs your bot to display its pack */
    pack: function(player){
        var b = this.get_bot(player);
        if(b!= null && b.bot !== null){
            b.bot.setSitting(true);
            player.openInventory(b.inventory);
        }
    },
    store: _store
},true);

exports.bot = bot;

command('help',function(params, sender){
    bot.help(sender);
});
command('summon',function(params, sender){
    bot.summon(sender);
});
command('dismiss',function(params, sender){
    bot.dismiss(sender);
});
command('stay',function(params, sender){
    bot.stay(sender);
});
command('come',function(params, sender){
    bot.come(sender);
});
command('pack',function(params, sender){
    bot.pack(sender);
});
