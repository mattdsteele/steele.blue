module Jekyll
  class SpeakerDeck < Liquid::Tag

    def initialize(name, id, tokens)
      super
      @id = id
    end

    def render(context)
      %(<script async class="speakerdeck-embed" data-id="#{id}" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>)
    end
  end
end

Liquid::Template.register_tag('speakerdeck', Jekyll::SpeakerDeck)

