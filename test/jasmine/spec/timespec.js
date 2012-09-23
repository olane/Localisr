describe('The time conversion module', function(){
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

    it('should correctly localise time strings', function(){
        targetTimezone = 'GMT';
        expect(convertTimeString('10:32 EST', '+0500', 'HH:mm')).toBe('05:32 GMT');
    });

    it('should correctly parse and convert time strings without minutes', function(){
        targetTimezone = 'GMT';
        expect(parseTime('10 am EST', 'EST')).toBe('03 pm GMT');
    });

    it('should correctly parse and convert time strings with minutes', function(){
        targetTimezone = 'GMT';
        expect(parseTimeWithMinutes('10:22 EST', 'EST')).toBe('15:22 GMT');
    });

    describe('The regular expressions for parsing time strings', function(){
        it('should be able to detect multiple valid times in a string amongst other text', function(){
            var testString = 'Lorem ipsum 18:32 GMT dolor 10:23 PST sit amet';
            var matches = testString.match(r.regexp.time.matcher);
            expect(matches.length).toBe(2);
        });

        it('should support times in 12-hour format', function(){
            expect('10am EST'.match(r.regexp.time.matcher).length).toBe(1);
        });

        it('should support AM/PM in upper or lower case', function(){
            var testString = '10AM EST foo 10am EST foo 10pm EST foo 10PM EST';
            var matches = testString.match(r.regexp.time.matcher);
            expect(matches.length).toBe(4);
        });

        it('should support time zone acronyms in upper or lower case', function(){
            var testString = '10AM est foo 10AM EST foo 10PM pst foo 10PM EST';
            var matches = testString.match(r.regexp.time.matcher);
            expect(matches.length).toBe(4);
        });

        it('should support multiple consecutive times with only whitespace between them', function(){
            var testString = '10AM EST 10AM EST 10AM EST';
            var matches = testString.match(r.regexp.time.matcher);
            expect(matches.length).toBe(3);
        });

        it('should support multiple consecutive times with commas between them', function(){
            var testString = '10AM EST,10AM EST,10AM EST';
            var matches = testString.match(r.regexp.time.matcher);
            expect(matches.length).toBe(3);
        });

        it('should support times without minutes', function(){
            expect('10am gmt'.match(r.regexp.time.matcher).length).toBe(1);
        });


        it('should support optional whitespace between the time and AM/PM', function(){
            expect('10 am gmt'.match(r.regexp.time.matcher).length).toBe(1);
        });
    });





    // it("should be able to play a Song", function() {
    //   player.play(song);
    //   expect(player.currentlyPlayingSong).toEqual(song);

    //   //demonstrates use of custom matcher
    //   expect(player).toBePlaying(song);
    // });

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
});
