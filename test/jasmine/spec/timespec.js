describe('The time conversion module', function() {
    // var player;
    // var song;

    // beforeEach(function() {
    //   player = new Player();
    //   song = new Song();
    // });

    // it("should be able to play a Song", function() {
    //   player.play(song);
    //   expect(player.currentlyPlayingSong).toEqual(song);

    //   //demonstrates use of custom matcher
    //   expect(player).toBePlaying(song);
    // });

    it('should be able to convert numerical UTC offsets to the correct string', function(){
        expect(offsetToString(5)).toEqual('+0500');
        expect(offsetToString(-7)).toEqual('-0700');
        expect(offsetToString(0)).toEqual('+0000');
        expect(offsetToString(82)).toEqual('+8200');
        expect(offsetToString(-13.75)).toEqual('-1345');
        expect(offsetToString(7.25)).toEqual('+0715');
    });

    it('should be able to get a valid string representing the UTC offset for a timezone specified by its acronym', function(){
        targetTimezone = 'EST';
        expect(zoneToOffsetString('GMT')).toEqual('+0500');
    });

    // describe("when song has been paused", function() {
    //   beforeEach(function() {
    //     player.play(song);
    //     player.pause();
    //   });

    //   it("should indicate that the song is currently paused", function() {
    //     expect(player.isPlaying).toBeFalsy();

    //     // demonstrates use of 'not' with a custom matcher
    //     expect(player).not.toBePlaying(song);
    //   });

    //   it("should be possible to resume", function() {
    //     player.resume();
    //     expect(player.isPlaying).toBeTruthy();
    //     expect(player.currentlyPlayingSong).toEqual(song);
    //   });
    // });

    // // demonstrates use of spies to intercept and test method calls
    // it("tells the current song if the user has made it a favorite", function() {
    //   spyOn(song, 'persistFavoriteStatus');

    //   player.play(song);
    //   player.makeFavorite();

    //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    // });

    // //demonstrates use of expected exceptions
    // describe("#resume", function() {
    //   it("should throw an exception if song is already playing", function() {
    //     player.play(song);

    //     expect(function() {
    //       player.resume();
    //     }).toThrow("song is already playing");
    //   });
    // });
});
