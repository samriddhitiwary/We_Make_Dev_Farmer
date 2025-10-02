import Collapsible from 'react-native-collapsible';
import Markdown from 'react-native-markdown-display';

const RemedyAccordion = ({ remedy }) => {
  const [activeSection, setActiveSection] = useState(null);

  // Split remedy markdown into sections
  const sections = remedy.split("## ").filter(Boolean).map(section => {
    const [title, ...contentArr] = section.split("\n");
    return { title, content: contentArr.join("\n").trim() };
  });

  return (
    <View style={styles.remedyContainer}>
      <Text style={styles.remedyTitle}>Suggested Remedy</Text>
      {sections.map((sec, idx) => (
        <View key={idx} style={styles.accordionItem}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setActiveSection(activeSection === idx ? null : idx)}
            activeOpacity={0.7}
          >
            <Text style={styles.accordionTitle}>{sec.title}</Text>
            <Icon 
              name={activeSection === idx ? "chevron-up" : "chevron-down"} 
              size={22} 
              color={COLORS.primaryButton} 
            />
          </TouchableOpacity>

          <Collapsible collapsed={activeSection !== idx}>
            <Markdown style={markdownStyles}>{sec.content}</Markdown>
          </Collapsible>
        </View>
      ))}
    </View>
  );
};
